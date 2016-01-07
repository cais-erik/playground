package com.cais.newb.web;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.cais.newb.Library;

@Controller
public class SphinctController {

	private static final String	defaultEcho	= "someDefaultValue";

	@Inject
	private Library				lib;

	@RequestMapping("/helloWorld")
	public String helloWorldHandler(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		if (echo.equals(defaultEcho)) {
			echo = lib.getFileResourceContents();
		}

		viewModel.addAttribute("echo", echo);
		return "helloWorld.jsp";
	}

	@RequestMapping("/helloWorld2")
	public String helloWorldHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld3")
	public String helloWorldHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld4")
	public String helloWorldHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld5")
	public String helloWorldHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld6")
	public String helloWorldHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld7")
	public String helloWorldHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld8")
	public String helloWorldHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld9")
	public String helloWorldHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld10")
	public String helloWorldHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld11")
	public String helloWorldHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld12")
	public String helloWorldHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld13")
	public String helloWorldHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld14")
	public String helloWorldHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld15")
	public String helloWorldHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld16")
	public String helloWorldHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld17")
	public String helloWorldHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld18")
	public String helloWorldHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld19")
	public String helloWorldHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld20")
	public String helloWorldHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld21")
	public String helloWorldHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld22")
	public String helloWorldHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld23")
	public String helloWorldHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld24")
	public String helloWorldHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld25")
	public String helloWorldHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld26")
	public String helloWorldHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld27")
	public String helloWorldHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld28")
	public String helloWorldHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld29")
	public String helloWorldHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/helloWorld30")
	public String helloWorldHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld1")
	public String goodbyeWorldHandler31(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld2")
	public String goodbyeWorldHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld3")
	public String goodbyeWorldHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld4")
	public String goodbyeWorldHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld5")
	public String goodbyeWorldHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld6")
	public String goodbyeWorldHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld7")
	public String goodbyeWorldHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld8")
	public String goodbyeWorldHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld9")
	public String goodbyeWorldHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld10")
	public String goodbyeWorldHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld11")
	public String goodbyeWorldHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld12")
	public String goodbyeWorldHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld13")
	public String goodbyeWorldHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld14")
	public String goodbyeWorldHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld15")
	public String goodbyeWorldHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld16")
	public String goodbyeWorldHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld17")
	public String goodbyeWorldHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld18")
	public String goodbyeWorldHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld19")
	public String goodbyeWorldHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld20")
	public String goodbyeWorldHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld21")
	public String goodbyeWorldHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld22")
	public String goodbyeWorldHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld23")
	public String goodbyeWorldHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld24")
	public String goodbyeWorldHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld25")
	public String goodbyeWorldHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld26")
	public String goodbyeWorldHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld27")
	public String goodbyeWorldHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld28")
	public String goodbyeWorldHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld29")
	public String goodbyeWorldHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeWorld30")
	public String goodbyeWorldHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloWorldHandler(echo, viewModel);
	}
}
