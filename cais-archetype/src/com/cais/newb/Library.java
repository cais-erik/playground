package com.cais.newb;

import java.io.RandomAccessFile;
import java.lang.invoke.MethodHandles;
import java.net.URL;

import org.apache.log4j.Logger;

public class Library {

	private static Logger		log				= Logger.getLogger(MethodHandles.lookup().lookupClass());

	public static final String	couldNotReadMsg	= "[Couldn't read the file, sillypants!]";

	private static final String	resourcePath	= "textResource.txt";
	private static final String	readOnlyMode	= "r";

	public boolean someLibraryMethod() {
		return true;
	}

	public String getFileResourceContents() {
		URL rsrcFileUrl = Library.class.getResource(resourcePath);
		String fileContents = readResourceContents(rsrcFileUrl);
		return fileContents;
	}

	public static void main(String[] args) {
		log.warn("Resource file contains:  " + new Library().getFileResourceContents());
	}

	private static String readResourceContents(URL rsrcFileUrl) {
		try (RandomAccessFile rsrcFile = new RandomAccessFile(rsrcFileUrl.getFile(), readOnlyMode)) {
			String fileContents = rsrcFile.readLine();
			return fileContents;
		}
		catch (Exception e) {
			e.printStackTrace();
		}

		return couldNotReadMsg;
	}
}
