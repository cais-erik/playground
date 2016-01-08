package com.cais.newb.entities;

import javax.persistence.*;

@Entity
@Table(name = "Widgets")
public class Widget {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long	id		= null;

	@Column(name = "name", nullable = false, length = 100)
	private String	name	= null;

	public Widget() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
