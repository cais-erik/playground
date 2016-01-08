package com.cais.newb.dao;

import java.util.*;

import com.cais.newb.entities.*;

public class WidgetDao extends AbstractDao {

	public List<Widget> findAll() {
		@SuppressWarnings("unchecked")
		List<Widget> list = getSession().createCriteria(Widget.class).list();
		return list;
	}
}
