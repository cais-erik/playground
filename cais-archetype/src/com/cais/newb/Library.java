package com.cais.newb;

import java.io.RandomAccessFile;
import java.lang.invoke.MethodHandles;
import java.net.URL;

import org.apache.log4j.Logger;

public class Library {

	private static Logger log = Logger.getLogger(MethodHandles.lookup().lookupClass());

	public boolean someLibraryMethod() {
		return true;
	}

	public static void main(String[] args) {
		URL rsrcFileUrl = Library.class.getResource("textResource.txt");
		String fileContents = readResourceContents(rsrcFileUrl);

		log.warn("Resource file contains:  " + fileContents);
	}

	private static String readResourceContents(URL rsrcFileUrl) {

		try (RandomAccessFile rsrcFile = new RandomAccessFile(rsrcFileUrl.getFile(), "r")) {
			String fileContents = rsrcFile.readLine();
			return fileContents;
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return "[Couldn't read the file, sillypants!]";
	}
}
