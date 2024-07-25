<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'nip',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'picture'
    ];

    protected $hidden = [
        'password',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'id'        => $this->id,
            'email'     => $this->email,
            'name'      => $this->name,
            'phone'     => $this->phone,
            'role'      => $this->role,
            'picture'   => $this->picture,
            'status'    => $this->status
        ];
    }
}
