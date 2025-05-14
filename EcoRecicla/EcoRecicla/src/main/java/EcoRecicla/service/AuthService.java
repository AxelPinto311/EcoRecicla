package EcoRecicla.service;

import EcoRecicla.model.dto.LoginDTO;
import EcoRecicla.model.dto.RegisterDTO;
import EcoRecicla.model.entity.Role;
import EcoRecicla.model.entity.User;
import EcoRecicla.model.enums.Proveedor;
import EcoRecicla.model.enums.RoleEnum;
import EcoRecicla.repository.RoleRepository;
import EcoRecicla.repository.UserRepository;
import EcoRecicla.security.jwt.JwtUtil;
import EcoRecicla.security.jwt.Tokens;
import EcoRecicla.security.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;


@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private MyUserDetailsService myUserDetailsService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public Tokens login(LoginDTO loginDTO) {
        Authentication authentication= authentication(loginDTO);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new Tokens(jwtUtil.accessToken(authentication), jwtUtil.refreshToken(authentication) );
    }

    public Tokens register(RegisterDTO registerDTO) {
        if(userRepository.existsUserByUsername(registerDTO.name())){
            new BadCredentialsException("Ya existe un usuario con ese nombre");
        }else if (userRepository.existsUserByEmail(registerDTO.email())){
            new BadCredentialsException("Ya existe un usuario con ese email");
        }

        Set<Role> role=roleRepository.findRoleByRoleEnum(RoleEnum.USER);
        if (role.isEmpty()){
            throw new IllegalArgumentException("No se puede registrar el usuario");
        }

        User user =User.builder()
                .username(registerDTO.name())
                .email(registerDTO.email())
                .password(passwordEncoder.encode(registerDTO.password()))
                .roles(role)
                .proveedor(Proveedor.APP)
                .build();


        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword(), this.getAuthorities(user));
        SecurityContextHolder.getContext().setAuthentication(authentication);
         userRepository.save(user);

         return new Tokens(jwtUtil.accessToken(authentication), jwtUtil.refreshToken(authentication));
    }


    private Authentication authentication(LoginDTO loginDTO) {
        UserDetails userDetails= myUserDetailsService.loadUserByUsername(loginDTO.email());

        if(userDetails==null || passwordEncoder.matches(loginDTO.password(), userDetails.getPassword())) {
            throw new BadCredentialsException("Nombre de usuario o contraseña  incorrecta");
        }

        return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities());
    }

    private List<SimpleGrantedAuthority> getAuthorities(User user) {
        List<SimpleGrantedAuthority> authorityList= user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_"+role.getRoleEnum().name())).toList();
        return authorityList;
    }
}
