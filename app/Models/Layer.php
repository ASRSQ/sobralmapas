<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Layer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'layer', 'description', 'category_id','subcategory_id'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
        public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

}
