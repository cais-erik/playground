package com.cais.newb.beans;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.cais.newb.*;

@Component
public class SpringCodeConfiguration {

	@Bean
	public Library instance() {
		return new LibraryImpl();
	}
}
