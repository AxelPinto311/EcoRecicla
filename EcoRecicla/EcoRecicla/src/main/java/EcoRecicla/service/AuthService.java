package EcoRecicla.service;

import EcoRecicla.exceptions.EmailAlreadyExistsException;
import EcoRecicla.exceptions.UsernameAlreadyExistsException;
import EcoRecicla.model.dto.LoginDto;
import EcoRecicla.model.dto.RegisterDto;
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

    public Tokens login(LoginDto loginDTO) {
        Authentication authentication= this.authentication(loginDTO);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new Tokens(jwtUtil.accessToken(authentication), jwtUtil.refreshToken(authentication) );
    }

    public Tokens register(RegisterDto registerDTO) {
        if(userRepository.existsUserByUsername(registerDTO.name())){
            throw new UsernameAlreadyExistsException("Ya existe un usuario con este nombre");
        }else if (userRepository.existsUserByEmail(registerDTO.email())){
            throw new EmailAlreadyExistsException("Ya existe un usuario con este email");
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


    private Authentication authentication(LoginDto loginDTO) {
        UserDetails userDetails= myUserDetailsService.loadUserByUsername(loginDTO.email().trim());

        if(userDetails==null || !passwordEncoder.matches(loginDTO.password(), userDetails.getPassword())) {
            throw new BadCredentialsException("Correo o contraseña  incorrecta");
        }

        return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities());
    }

    private List<SimpleGrantedAuthority> getAuthorities(User user) {
        List<SimpleGrantedAuthority> authorityList= user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_"+role.getRoleEnum().name())).toList();
        return authorityList;
    }
}
