<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-26 13:10:55                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoRequirement extends BaseTaskModel
	{
		protected $project = null;
		protected $projectId = null;
		protected $name = null;
		protected $description = null;
		protected $sortOrder = null;
		
		public function __sleep()
		{
			return array_merge(
				parent::__sleep(),
				array('id', 'projectId', 'name', 'description', 'sortOrder')
			);
		}
		
		/**
		 * @return Project
		**/
		public function getProject()
		{
			if (!$this->project && $this->projectId) {
				$this->project = Project::dao()->getById($this->projectId);
			}
			
			return $this->project;
		}
		
		public function getProjectId()
		{
			return $this->projectId;
		}
		
		/**
		 * @return Requirement
		**/
		public function setProject(Project $project)
		{
			$this->project = $project;
			$this->projectId = $project->getId();
			
			return $this;
		}
		
		/**
		 * @return Requirement
		**/
		public function setProjectId($id)
		{
			$this->project = null;
			$this->projectId = $id;
			
			return $this;
		}
		
		/**
		 * @return Requirement
		**/
		public function dropProject()
		{
			$this->project = null;
			$this->projectId = null;
			
			return $this;
		}
		
		public function getName()
		{
			return $this->name;
		}
		
		/**
		 * @return Requirement
		**/
		public function setName($name)
		{
			$this->name = $name;
			
			return $this;
		}
		
		public function getDescription()
		{
			return $this->description;
		}
		
		/**
		 * @return Requirement
		**/
		public function setDescription($description)
		{
			$this->description = $description;
			
			return $this;
		}
		
		public function getSortOrder()
		{
			return $this->sortOrder;
		}
		
		/**
		 * @return Requirement
		**/
		public function setSortOrder($sortOrder)
		{
			$this->sortOrder = $sortOrder;
			
			return $this;
		}
	}
?>