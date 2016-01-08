package com.cais.newb.dao;

import java.util.*;

import javax.inject.*;

import org.junit.*;
import org.junit.runner.*;
import org.springframework.test.context.*;
import org.springframework.test.context.junit4.*;
import org.springframework.transaction.annotation.*;

import com.cais.newb.entities.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext.xml" })
public class WidgetDaoTester {

	@Inject
	private WidgetDao dao;

	@Test
	@Transactional
	public void testWidgetDao() {
		List<Widget> list = dao.findAll();
		assert list.isEmpty();
	}
}
