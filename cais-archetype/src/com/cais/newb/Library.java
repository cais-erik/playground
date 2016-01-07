package com.cais.newb;

import java.io.*;
import java.lang.invoke.MethodHandles;
import java.net.*;

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
		String fileContents = readResourceContents();
		return fileContents;
	}

	public static void main(String[] args) {
		log.warn("Resource file contains:  " + new Library().getFileResourceContents());
	}

	private static String readResourceContents() {
		try {
			URL rsrcFileUrl = Library.class.getResource(resourcePath);
			URI rsrcFileUri = rsrcFileUrl.toURI();
			File rsrcFileLoc = new File(rsrcFileUri);
			try (RandomAccessFile rsrcFile = new RandomAccessFile(rsrcFileLoc, readOnlyMode)) {
				String fileContents = rsrcFile.readLine();
				return fileContents;
			}
		}
		catch (Exception e) {
			log.error("Exc while reading resource file:", e);
		}

		return couldNotReadMsg;
	}
}
