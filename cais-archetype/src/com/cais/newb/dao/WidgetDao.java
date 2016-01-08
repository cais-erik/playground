package com.cais.newb.dao;

import java.util.*;

import org.springframework.stereotype.*;

import com.cais.newb.entities.*;

@Repository
public class WidgetDao extends AbstractDao {

	public List<Widget> findAll() {
		@SuppressWarnings("unchecked")
		List<Widget> list = getSession().createCriteria(Widget.class).list();
		return list;
	}
}
