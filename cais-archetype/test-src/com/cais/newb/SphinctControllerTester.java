package com.cais.newb;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import java.io.UnsupportedEncodingException;
import java.lang.invoke.MethodHandles;
import java.util.*;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.request.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext.xml", "classpath:dispatcher-servlet.xml" })
@WebAppConfiguration
public class SphinctControllerTester {

	private static final int				httpUnauthorizedStatus	= 403;
	private static final String				contentExceptionMessage	= "[Couldn't retrieve content due to exception.]";

	private static final Logger				log						= Logger
			.getLogger(MethodHandles.lookup().lookupClass());

	@Inject
	private WebApplicationContext			webAppContext;

	private MockMvc							mockMvc					= null;
	private MockHttpServletRequestBuilder	requestBuilder			= null;
	private MvcResult						result					= null;
	private MockHttpServletResponse			response				= null;
	private User							user;

	@Test
	public void testSpringSecurityPreventsNonAuthedAccess() throws Exception {
		givenDestinationUri("/helloWorld");

		whenRequestIsExecuted();

		thenAssertRedirectedToLogin();
	}

	@Test
	public void testReturnedViewName() throws Exception {

		givenUser();
		givenDestinationUri("/helloWorld");

		whenRequestIsExecuted();

		thenAssertForwardDestinationWas("helloWorld.jsp");
	}

	@Test
	public void testBadRole() throws Exception {

		givenUser("ROLE_USER");
		givenDestinationUri("/youNeedHonkylipsRole");

		whenRequestIsExecuted();

		thenAssertUnauthorized();
	}

	@Test
	public void testGoodRole() throws Exception {

		givenUser("ROLE_HONKYLIPS");
		givenDestinationUri("/youNeedHonkylipsRole");

		whenRequestIsExecuted();

		thenAssertForwardDestinationWas("honkylips.jsp");
	}

	private void givenUser(String... roles) {

		List<SimpleGrantedAuthority> list = new ArrayList<>();

		for (String role : roles) {
			list.add(new SimpleGrantedAuthority(role));
		}

		user = new User("Ray", "Finkel", list);
	}

	private void thenAssertForwardDestinationWas(String expectedViewName) {
		String actualViewName = result.getModelAndView().getViewName();
		assert expectedViewName.equals(actualViewName) : "Did not get routed to " + expectedViewName
				+ ", instead was routed to " + actualViewName;
	}

	private void givenDestinationUri(String uri) {
		mockMvc = MockMvcBuilders.webAppContextSetup(webAppContext).apply(springSecurity()).build();
		requestBuilder = MockMvcRequestBuilders.get(uri);
		if (user != null) {
			requestBuilder = requestBuilder.with(user(user));
		}

	}

	private void whenRequestIsExecuted() throws Exception {
		result = mockMvc.perform(requestBuilder).andReturn();
		response = result.getResponse();
		logResponseBasics();
	}

	private void thenAssertUnauthorized() {
		assert response.getStatus() == httpUnauthorizedStatus : response.getStatus()
				+ " was what I got, but I expected " + httpUnauthorizedStatus;
	}

	private void thenAssertRedirectedToLogin() {
		String redirectedUrl = response.getRedirectedUrl();
		String expectedRedirectUrl = "login";
		assert redirectedUrl.endsWith(expectedRedirectUrl) : redirectedUrl;
	}

	private void logResponseBasics() {
		log.warn("Fwd Url:       " + response.getForwardedUrl());
		log.warn("Content:       " + responseContent());
		log.warn("Redirect Url:  " + response.getRedirectedUrl());
		log.warn("Status:        " + response.getStatus());
	}

	private String responseContent() {
		try {
			return response.getContentAsString();
		}
		catch (UnsupportedEncodingException e) {
			return contentExceptionMessage;
		}
	}
}
