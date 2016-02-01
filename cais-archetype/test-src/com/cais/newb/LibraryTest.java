package com.cais.newb;

import java.lang.invoke.*;
import java.util.*;

import javax.inject.*;

import org.apache.log4j.*;
import org.junit.*;
import org.junit.runner.*;
import org.springframework.test.context.*;
import org.springframework.test.context.junit4.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext.xml" })
public class LibraryTest {

	private static final Logger	log	= Logger.getLogger(MethodHandles.lookup().lookupClass());

	@Inject
	private Library				lib;

	@Test
	public void testSomeLibraryMethod() {
		String contents = lib.getFileResourceContents();

		assert !contents.equals(LibraryImpl.couldNotReadMsg) : "got the could-not-read msg of " + contents;
	}

	@Test
	public void noLambdaTest() {
		String[] array = new String[5];
		array[0] = "Fred";
		array[1] = "Barry";
		array[2] = "Erik";
		array[3] = "Jon";
		array[4] = "Stamos";

		log.warn("Before:  " + Arrays.toString(array));

		Arrays.sort(array, new Comparator<String>() {

			@Override
			public int compare(String first, String second) {
				return first.compareTo(second);
			}
		});

		log.warn("After:  " + Arrays.toString(array));
	}

	@Test
	public void lambdaTest() {
		String[] array = new String[5];
		array[0] = "Fred";
		array[1] = "Barry";
		array[2] = "Erik";
		array[3] = "Jon";
		array[4] = "Stamos";

		log.warn("Before:  " + Arrays.toString(array));

		Arrays.sort(array, (first, second) -> first.compareTo(second));

		log.warn("After:  " + Arrays.toString(array));
	}
}
