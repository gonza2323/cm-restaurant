package com.example.restaurant.usuario;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    AccessTokenDto token;
    AuthUserDto user;
}
