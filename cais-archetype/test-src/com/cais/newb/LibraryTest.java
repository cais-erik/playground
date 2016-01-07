package com.cais.newb;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext.xml" })
public class LibraryTest {

	@Inject
	private Library lib;

	@Test
	public void testSomeLibraryMethod() {
		String contents = lib.getFileResourceContents();

		assert !contents.equals(LibraryImpl.couldNotReadMsg) : "got the could-not-read msg of " + contents;
	}
}
