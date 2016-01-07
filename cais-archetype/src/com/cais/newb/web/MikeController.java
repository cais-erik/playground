package com.cais.newb.web;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.cais.newb.Library;

@Controller
public class MikeController {

	private static final String	defaultEcho	= "someDefaultValue";

	@Inject
	private Library				lib;

	@RequestMapping("/helloMike")
	public String helloMikeHandler(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		if (echo.equals(defaultEcho)) {
			echo = lib.getFileResourceContents();
		}

		viewModel.addAttribute("echo", echo);
		return "helloMike.jsp";
	}

	@RequestMapping("/helloMike2")
	public String helloMikeHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike3")
	public String helloMikeHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike4")
	public String helloMikeHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike5")
	public String helloMikeHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike6")
	public String helloMikeHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike7")
	public String helloMikeHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike8")
	public String helloMikeHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike9")
	public String helloMikeHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike10")
	public String helloMikeHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike11")
	public String helloMikeHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike12")
	public String helloMikeHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike13")
	public String helloMikeHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike14")
	public String helloMikeHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike15")
	public String helloMikeHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike16")
	public String helloMikeHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike17")
	public String helloMikeHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike18")
	public String helloMikeHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike19")
	public String helloMikeHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike20")
	public String helloMikeHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike21")
	public String helloMikeHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike22")
	public String helloMikeHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike23")
	public String helloMikeHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike24")
	public String helloMikeHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike25")
	public String helloMikeHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike26")
	public String helloMikeHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike27")
	public String helloMikeHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike28")
	public String helloMikeHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike29")
	public String helloMikeHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/helloMike30")
	public String helloMikeHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike1")
	public String goodbyeMikeHandler31(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike2")
	public String goodbyeMikeHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike3")
	public String goodbyeMikeHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike4")
	public String goodbyeMikeHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike5")
	public String goodbyeMikeHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike6")
	public String goodbyeMikeHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike7")
	public String goodbyeMikeHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike8")
	public String goodbyeMikeHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike9")
	public String goodbyeMikeHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike10")
	public String goodbyeMikeHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike11")
	public String goodbyeMikeHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike12")
	public String goodbyeMikeHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike13")
	public String goodbyeMikeHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike14")
	public String goodbyeMikeHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike15")
	public String goodbyeMikeHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike16")
	public String goodbyeMikeHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike17")
	public String goodbyeMikeHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike18")
	public String goodbyeMikeHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike19")
	public String goodbyeMikeHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike20")
	public String goodbyeMikeHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike21")
	public String goodbyeMikeHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike22")
	public String goodbyeMikeHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike23")
	public String goodbyeMikeHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike24")
	public String goodbyeMikeHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike25")
	public String goodbyeMikeHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike26")
	public String goodbyeMikeHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike27")
	public String goodbyeMikeHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike28")
	public String goodbyeMikeHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike29")
	public String goodbyeMikeHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeMike30")
	public String goodbyeMikeHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloMikeHandler(echo, viewModel);
	}
}
