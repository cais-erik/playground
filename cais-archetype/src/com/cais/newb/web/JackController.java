package com.cais.newb.web;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.cais.newb.Library;

@Controller
public class JackController {

	private static final String	defaultEcho	= "someDefaultValue";

	@Inject
	private Library				lib;

	@RequestMapping("/helloJack")
	public String helloJackHandler(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		if (echo.equals(defaultEcho)) {
			echo = lib.getFileResourceContents();
		}

		viewModel.addAttribute("echo", echo);
		return "helloJack.jsp";
	}

	@RequestMapping("/helloJack2")
	public String helloJackHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack3")
	public String helloJackHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack4")
	public String helloJackHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack5")
	public String helloJackHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack6")
	public String helloJackHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack7")
	public String helloJackHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack8")
	public String helloJackHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack9")
	public String helloJackHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack10")
	public String helloJackHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack11")
	public String helloJackHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack12")
	public String helloJackHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack13")
	public String helloJackHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack14")
	public String helloJackHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack15")
	public String helloJackHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack16")
	public String helloJackHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack17")
	public String helloJackHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack18")
	public String helloJackHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack19")
	public String helloJackHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack20")
	public String helloJackHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack21")
	public String helloJackHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack22")
	public String helloJackHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack23")
	public String helloJackHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack24")
	public String helloJackHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack25")
	public String helloJackHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack26")
	public String helloJackHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack27")
	public String helloJackHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack28")
	public String helloJackHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack29")
	public String helloJackHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/helloJack30")
	public String helloJackHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack1")
	public String goodbyeJackHandler31(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack2")
	public String goodbyeJackHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack3")
	public String goodbyeJackHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack4")
	public String goodbyeJackHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack5")
	public String goodbyeJackHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack6")
	public String goodbyeJackHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack7")
	public String goodbyeJackHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack8")
	public String goodbyeJackHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack9")
	public String goodbyeJackHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack10")
	public String goodbyeJackHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack11")
	public String goodbyeJackHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack12")
	public String goodbyeJackHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack13")
	public String goodbyeJackHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack14")
	public String goodbyeJackHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack15")
	public String goodbyeJackHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack16")
	public String goodbyeJackHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack17")
	public String goodbyeJackHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack18")
	public String goodbyeJackHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack19")
	public String goodbyeJackHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack20")
	public String goodbyeJackHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack21")
	public String goodbyeJackHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack22")
	public String goodbyeJackHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack23")
	public String goodbyeJackHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack24")
	public String goodbyeJackHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack25")
	public String goodbyeJackHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack26")
	public String goodbyeJackHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack27")
	public String goodbyeJackHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack28")
	public String goodbyeJackHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack29")
	public String goodbyeJackHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeJack30")
	public String goodbyeJackHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloJackHandler(echo, viewModel);
	}
}
