package com.cais.newb;

import org.junit.Test;

public class LibraryTest {

	@Test
	public void testSomeLibraryMethod() {
		Library classUnderTest = new LibraryImpl();
		String contents = classUnderTest.getFileResourceContents();

		assert !contents.equals(LibraryImpl.couldNotReadMsg) : "got the could-not-read msg of " + contents;
	}
}
