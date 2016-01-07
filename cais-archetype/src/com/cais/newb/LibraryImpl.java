package com.cais.newb;

import java.io.*;
import java.lang.invoke.MethodHandles;
import java.net.*;

import org.apache.log4j.Logger;

public class LibraryImpl implements Library {

	private static Logger		log				= Logger.getLogger(MethodHandles.lookup().lookupClass());

	public static final String	couldNotReadMsg	= "[Couldn't read the file, sillypants!]";

	private static final String	resourcePath	= "textResource.txt";
	private static final String	readOnlyMode	= "r";

	public boolean someLibraryMethod() {
		return true;
	}

	@Override
	public String getFileResourceContents() {
		String fileContents = readResourceContents();
		return fileContents;
	}

	private static String readResourceContents() {

		try {
			URL rsrcFileUrl = LibraryImpl.class.getResource(resourcePath);
			URI rsrcFileUri = rsrcFileUrl.toURI();
			File rsrcFileLoc = new File(rsrcFileUri);
			try (RandomAccessFile rsrcFile = new RandomAccessFile(rsrcFileLoc, readOnlyMode)) {
				String fileContents = rsrcFile.readLine();

				log.warn("Resource file contains:  " + fileContents);
				return fileContents;
			}
		}
		catch (Exception e) {
			log.error("Exc while reading resource file:", e);
		}

		return couldNotReadMsg;
	}
}
