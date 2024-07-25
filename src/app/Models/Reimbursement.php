<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reimbursement extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'reimbursements';

    protected $fillable = [
        'id',
        'submitted_by',
        'submitted_date',
        'description',
        'supporting_file',
        'responded_by',
        'responded_date',
        'responded_status',
    ];
}