<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReimbursementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reimbursements', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('submitted_by', 100);
            $table->date('submitted_date');
            $table->text('description');
            $table->string('supporting_file', 200);
            $table->string('responded_by', 100)->nullable();
            $table->dateTime('responded_date')->nullable();
            $table->string('responded_status', 20)->nullable();
            $table->timestamps(); // This will create both created_at and updated_at columns

            $table->foreign('submitted_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('responded_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reimbursements');
    }
}
