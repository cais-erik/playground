package com.cais.newb;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
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

	@Inject
	private WebApplicationContext webAppContext;

	@Test
	public void testReturnedView() throws Exception {

		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webAppContext).build();
		MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/helloWorld");

		MvcResult result = mockMvc.perform(requestBuilder).andReturn();
		String actualViewName = result.getModelAndView().getViewName();
		String expectedViewName = "helloWorld.jsp";
		assert expectedViewName.equals(actualViewName) : "Did Fnot get routed to " + expectedViewName
				+ ", instead was routed to " + actualViewName;
	}
}
