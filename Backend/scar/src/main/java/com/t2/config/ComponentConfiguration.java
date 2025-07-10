package com.t2.config;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Configuration
public class ComponentConfiguration {

	@Bean
	public ModelMapper modelMapper() {
		ModelMapper modelMapper = new ModelMapper();
		// Fix lỗi ánh xạ collection: PersistentBag -> List
		Converter<Collection<Object>, List<Object>> collectionToListConverter = new Converter<>() {
			@Override
			public List<Object> convert(MappingContext<Collection<Object>, List<Object>> context) {
				return context.getSource() == null ? null : new ArrayList<>(context.getSource());
			}
		};

		modelMapper.addConverter(collectionToListConverter);

		return modelMapper;
	}

	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}
}
