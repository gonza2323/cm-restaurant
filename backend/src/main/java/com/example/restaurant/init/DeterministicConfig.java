package com.example.restaurant.init;

import net.datafaker.Faker;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;

@Configuration
public class DeterministicConfig {

    public static final long SEED = 12345L;

    @Bean
    public Random random() {
        return new Random(SEED);
    }

    @Bean
    public Faker faker() {
        return new Faker(new Random(SEED));
    }
}
