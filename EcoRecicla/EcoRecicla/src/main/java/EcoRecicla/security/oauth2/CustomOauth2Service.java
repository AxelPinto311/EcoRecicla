package EcoRecicla.security.oauth2;

import EcoRecicla.model.entity.Role;
import EcoRecicla.model.entity.User;
import EcoRecicla.model.enums.Proveedor;
import EcoRecicla.model.enums.RoleEnum;
import EcoRecicla.repository.RoleRepository;
import EcoRecicla.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class CustomOauth2Service extends OidcUserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Transactional
   @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oidcUser.getAttribute("sub");
        String email = oidcUser.getAttribute("email");

        User user= userRepository.findByEmail(email)
                .orElseGet(()-> createUser(oidcUser,provider,providerId));

        List<SimpleGrantedAuthority> authorityList= user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_"+role.getRoleEnum().name())).toList();


        Map<String,Object> attributes = oidcUser.getAttributes();


        return new DefaultOidcUser(authorityList,oidcUser.getIdToken(),new OidcUserInfo(attributes));

    }


    private User createUser(OidcUser oidcUser, String provider, String providerId) {
        Set<Role> role=roleRepository.findRoleByRoleEnum(RoleEnum.USER);
        if (role.isEmpty()){
            throw new IllegalArgumentException("No se puede registrar el usuario");
        }
        User user=User.builder()
                .username(oidcUser.getAttribute("name"))
                .email(oidcUser.getAttribute("email"))
                .password("GOOGLE_AUTH")
                .proveedor(Proveedor.valueOf(provider.toUpperCase()))
                .roles(role)
                .proveedor_id(providerId)
                .build();


        return userRepository.save(user);
    }

}
