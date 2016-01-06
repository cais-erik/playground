package com.cais.newb;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import com.cais.newb.Library;

public class LibraryTest {

	@Test
	public void testSomeLibraryMethod() {
		Library classUnderTest = new Library();
		assertTrue("someLibraryMethod should return 'true'", classUnderTest.someLibraryMethod());
	}
}
