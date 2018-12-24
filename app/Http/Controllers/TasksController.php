<?php

namespace App\Http\Controllers;

use App\Task;
use Illuminate\Http\Request;

class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tasks = Task::all();
        $response = [
            'msg' => 'List of all Tasks',
            'tasks' => $tasks
        ];
        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function store(Request $request)
    {
        $attributes =$this->validate($request, [
            'title' => ['required','min:3'],
            'description' => ['required','min:3'],
        ]);
        $task = Task::create($attributes);
        $message = [
            'msg' => 'Task created',
            'task' => $task
        ];
        return response()->json($message, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        $response = [
            'msg' => 'Task information',
            'task' => $task
        ];
        return response()->json($response, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function update(Request $request, Task $task)
    {
        $attributes =$this->validate($request, [
            'title' => ['required','min:3'],
            'description' => ['required','min:3'],
        ]);
        $task->update($attributes);
        $response = [
            'msg' => 'Task updated',
            'task' => $task
        ];

        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Task $task)
    {
        $task->delete();
        $response = [
            'msg' => 'Task deleted',
        ];
        return response()->json($response, 200);
    }
}