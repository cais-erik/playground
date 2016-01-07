package com.cais.newb.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.cais.newb.Library;

@Controller
public class SphinctController {

	private static final String defaultEcho = "someDefaultValue";

	@RequestMapping("/helloWorld")
	public String helloWorldHandler(
			@RequestParam(value = "echo", required = false, defaultValue = defaultEcho) String echo, Model viewModel) {
		if (echo.equals(defaultEcho)) {
			echo = new Library().getFileResourceContents();
		}

		viewModel.addAttribute("echo", echo);
		return "helloWorld";
	}
}
