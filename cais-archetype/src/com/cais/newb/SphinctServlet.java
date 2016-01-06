package com.cais.newb;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.*;

public class SphinctServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public SphinctServlet() {
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String contents = new Library().getFileResourceContents();

		System.out.println("Contents:  " + contents);

		response.getWriter().append("Served at: ").append(request.getContextPath()).append("\n").append(contents);
	}
}