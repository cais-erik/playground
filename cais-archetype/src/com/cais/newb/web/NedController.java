package com.cais.newb.web;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.cais.newb.Library;

@Controller
public class NedController {

	private static final String	defaultEcho	= "someDefaultValue";

	@Inject
	private Library				lib;

	@RequestMapping("/helloNed")
	public String helloNedHandler(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		if (echo.equals(defaultEcho)) {
			echo = lib.getFileResourceContents();
		}

		viewModel.addAttribute("echo", echo);
		return "helloNed.jsp";
	}

	@RequestMapping("/helloNed2")
	public String helloNedHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed3")
	public String helloNedHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed4")
	public String helloNedHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed5")
	public String helloNedHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed6")
	public String helloNedHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed7")
	public String helloNedHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed8")
	public String helloNedHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed9")
	public String helloNedHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed10")
	public String helloNedHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed11")
	public String helloNedHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed12")
	public String helloNedHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed13")
	public String helloNedHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed14")
	public String helloNedHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed15")
	public String helloNedHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed16")
	public String helloNedHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed17")
	public String helloNedHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed18")
	public String helloNedHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed19")
	public String helloNedHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed20")
	public String helloNedHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed21")
	public String helloNedHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed22")
	public String helloNedHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed23")
	public String helloNedHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed24")
	public String helloNedHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed25")
	public String helloNedHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed26")
	public String helloNedHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed27")
	public String helloNedHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed28")
	public String helloNedHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed29")
	public String helloNedHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/helloNed30")
	public String helloNedHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed1")
	public String goodbyeNedHandler31(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed2")
	public String goodbyeNedHandler2(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed3")
	public String goodbyeNedHandler3(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed4")
	public String goodbyeNedHandler4(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed5")
	public String goodbyeNedHandler5(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed6")
	public String goodbyeNedHandler6(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed7")
	public String goodbyeNedHandler7(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed8")
	public String goodbyeNedHandler8(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed9")
	public String goodbyeNedHandler9(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed10")
	public String goodbyeNedHandler10(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed11")
	public String goodbyeNedHandler11(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed12")
	public String goodbyeNedHandler12(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed13")
	public String goodbyeNedHandler13(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed14")
	public String goodbyeNedHandler14(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed15")
	public String goodbyeNedHandler15(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed16")
	public String goodbyeNedHandler16(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed17")
	public String goodbyeNedHandler17(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed18")
	public String goodbyeNedHandler18(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed19")
	public String goodbyeNedHandler19(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed20")
	public String goodbyeNedHandler20(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed21")
	public String goodbyeNedHandler21(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed22")
	public String goodbyeNedHandler22(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed23")
	public String goodbyeNedHandler23(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed24")
	public String goodbyeNedHandler24(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed25")
	public String goodbyeNedHandler25(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed26")
	public String goodbyeNedHandler26(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed27")
	public String goodbyeNedHandler27(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed28")
	public String goodbyeNedHandler28(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed29")
	public String goodbyeNedHandler29(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}

	@RequestMapping("/goodbyeNed30")
	public String goodbyeNedHandler30(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		return helloNedHandler(echo, viewModel);
	}
}
