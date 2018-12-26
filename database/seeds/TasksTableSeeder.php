<?php

use Illuminate\Database\Seeder;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $task1 = new \App\Task([
            'name' => str_random(10),
        ]);
        $task1->save();

        $task2 = new \App\Task([
            'name' => str_random(10),
        ]);
        $task2->save();
    }
}

