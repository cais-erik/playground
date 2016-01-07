package com.cais.newb.web;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.cais.newb.Library;

@Controller
public class BobController {

	private static final String	defaultEcho	= "someDefaultValue";

	@Inject
	private Library				lib;

	@RequestMapping("/helloBob")
	public String helloBobHandler(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		if (echo.equals(defaultEcho)) {
			echo = lib.getFileResourceContents();
		}

		viewModel.addAttribute("echo", echo);
		return "helloBob.jsp";
	}

	@RequestMapping("/helloBob2")
	public String helloBobHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob3")
	public String helloBobHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob4")
	public String helloBobHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob5")
	public String helloBobHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob6")
	public String helloBobHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob7")
	public String helloBobHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob8")
	public String helloBobHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob9")
	public String helloBobHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob10")
	public String helloBobHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob11")
	public String helloBobHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob12")
	public String helloBobHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob13")
	public String helloBobHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob14")
	public String helloBobHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob15")
	public String helloBobHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob16")
	public String helloBobHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob17")
	public String helloBobHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob18")
	public String helloBobHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob19")
	public String helloBobHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob20")
	public String helloBobHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob21")
	public String helloBobHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob22")
	public String helloBobHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob23")
	public String helloBobHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob24")
	public String helloBobHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob25")
	public String helloBobHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob26")
	public String helloBobHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob27")
	public String helloBobHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob28")
	public String helloBobHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob29")
	public String helloBobHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/helloBob30")
	public String helloBobHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob1")
	public String goodbyeBobHandler31(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob2")
	public String goodbyeBobHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob3")
	public String goodbyeBobHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob4")
	public String goodbyeBobHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob5")
	public String goodbyeBobHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob6")
	public String goodbyeBobHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob7")
	public String goodbyeBobHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob8")
	public String goodbyeBobHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob9")
	public String goodbyeBobHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob10")
	public String goodbyeBobHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob11")
	public String goodbyeBobHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob12")
	public String goodbyeBobHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob13")
	public String goodbyeBobHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob14")
	public String goodbyeBobHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob15")
	public String goodbyeBobHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob16")
	public String goodbyeBobHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob17")
	public String goodbyeBobHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob18")
	public String goodbyeBobHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob19")
	public String goodbyeBobHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob20")
	public String goodbyeBobHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob21")
	public String goodbyeBobHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob22")
	public String goodbyeBobHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob23")
	public String goodbyeBobHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob24")
	public String goodbyeBobHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob25")
	public String goodbyeBobHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob26")
	public String goodbyeBobHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob27")
	public String goodbyeBobHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob28")
	public String goodbyeBobHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob29")
	public String goodbyeBobHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeBob30")
	public String goodbyeBobHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloBobHandler(echo, viewModel);
	}
}
