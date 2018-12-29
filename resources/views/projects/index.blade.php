@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="content">
            <div class="title">
                <h1>Tasks</h1>
            </div>
        </div>
        <div class="row col-md-10 table-responsive">
            <table id="tasksTable" class="table table-hover">
                <thead class="thead-dark">
                <tr class="text-center">
                    <th>#</th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
@endsection

@section('script')
    <script src="{{ asset('js/tasks.js') }}"></script>
@endsection
