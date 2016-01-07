package com.cais.newb.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.*;

import com.cais.newb.LibraryImpl;

public class HorribleOldStyleServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public HorribleOldStyleServlet() {
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String contents = new LibraryImpl().getFileResourceContents();

		System.out.println("Contents:  " + contents);

		response.getWriter().append("Served at: ").append(request.getContextPath()).append("\n").append(contents);
	}
}
