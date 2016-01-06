package com.cais.newb;

import org.junit.Test;

public class LibraryTest {

	@Test
	public void testSomeLibraryMethod() {
		Library classUnderTest = new Library();
		String contents = classUnderTest.getFileResourceContents();

		assert !contents.equals(Library.couldNotReadMsg) : "got the could-not-read msg of " + contents;
	}
}
