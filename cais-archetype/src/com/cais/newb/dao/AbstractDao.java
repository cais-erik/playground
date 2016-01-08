package com.cais.newb.dao;

import java.io.*;

import javax.inject.*;

import org.hibernate.*;

public abstract class AbstractDao {

	@Inject
	private SessionFactory sessionFactory;

	protected Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	public void persist(Object entity) {
		getSession().persist(entity);
	}

	public void findById(Class<?> entityClass, Serializable id) {
		getSession().get(entityClass, id);
	}

}
