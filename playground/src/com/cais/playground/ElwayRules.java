package com.cais.playground;

import java.util.logging.*;

public class ElwayRules {

	private Logger log = Logger.getAnonymousLogger();

	public ElwayRules() {
		log.info("Commit 1 while other things branched off.  And a third commit.");
		log.info(
				"For the CherryPick test:  committing something else to master thought ought conflict the cherry pick.");
	}

	public String getJackwagon() {
		return "Jack.  And his wagon.  Commit 2 while other things branched off.";
	}

	public String cherryPickThis() {
		return "bing";
	}
}
