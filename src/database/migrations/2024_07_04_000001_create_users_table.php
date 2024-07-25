<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('nip', 13)->unique();
            $table->string('name', 200);
            $table->string('email', 200)->unique();
            $table->string('phone', 13);
            $table->string('password', 60);
            $table->string('picture', 255);
            $table->string('status', 13)->default('active');
            $table->string('role', 30);
            $table->timestamps(); // This will create both created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
