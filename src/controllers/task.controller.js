import Task from "../models/Task";
import { getPagination } from '../libs/getPagination';

export const findAllTask = async (req, res) => {
  try {
    const {size, page, title} = req.query

    const {limit, offset} = getPagination(page, size);

    const condition = title ? {
      title:{ $regex: new RegExp(title), $options: "i"}
    }: {};

    const data = await Task.paginate(condition, { offset, limit});
    res.json({
      totalItems: data.totalDocs,
      tasks: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1 
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Something goes wrong retrieveving the task / Ocurrio un Erro mientras devlviamos todas las tareas",
    });
  }
};

export const createTask = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      message: "Content cannot be empty / el Contenido no puede estar vacio",
    });
  }

  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      done: req.body.done ? req.body.done : false,
    });
    const taskSaved = await newTask.save();
    res.json(taskSaved);
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Something goes wrong creating the task / Ocurrio un Error mientras se creaba una tareas",
    });
  }
};

export const findOneTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id ${id} does not exist` });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error retrieveing task",
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({
      message: "task were deleted succesfully",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Error, cannot delete tasks / Error, no se pudo eliminar la tarea",
    });
  }
};

export const findAllDoneTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ done: true });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Error, find a task / Error, no se encontro la tarea",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "task was updated succesfuly" });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Error, cannot update task / Error, no se pudo actualizar la tarea",
    });
  }
};
