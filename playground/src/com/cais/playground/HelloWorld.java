package com.cais.playground;

import java.util.Date;

public class HelloWorld {

	public static void main(String[] args) {

		System.out.println("hello world");
		System.out.println("added with 4th commit from Eclipse (no merge necessary)");
		System.out.println("Barry added with 5 commit from command line (stash/sphinct/pull/stash-pop)");
		System.out.println("added from Barry, along with altering another line.");
		System.out.println("added with 6 and there is more from Barry, baby, commit from Eclipse (no merge necessary)");
		System.out.println("added with 7 commit from command line (branch/merge/commit/push)");
		System.out.println("added from Erik's eclipse");
		System.out.println("adding another change from Erik's eclipse, no merge necessary");
		System.out.println("adding yet another change from Erik's eclipse, merge will be necessary");
		System.out.println("Boots w/ the fuurrrrrr...part quattro.");
		System.out.println("Part Trey.");
		// ORIG_HEAD test
		System.out.println("Change that really should conflict from Bob to Master");
	}

	public String notReally() {
		return "Bite me.  And my conflict inducing change.";
	}

	public String really() {
		return new Date().toString();
	}
}
