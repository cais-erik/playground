package com.cais.playground;

import java.util.logging.Logger;

public class ElwayRules {

	private Logger log = Logger.getAnonymousLogger();

	public ElwayRules() {
		log.info("Commit 1 while other things branched off");
	}

	public String getJackwagon() {
		return "Jack.  And his wagon.  Commit 2 while other things branched off.";
	}
}
