<?php
namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Reimbursement;

class ReimbursementController extends Controller {
    public function get(Request $request) {
        try {
            $user = $request->attributes->get('user');
            $reimbursement = new Reimbursement();
            $data = $reimbursement
            ->leftJoin('users as u1', 'reimbursements.submitted_by', '=', 'u1.id')
            ->leftJoin('users as u2', 'reimbursements.responded_by', '=', 'u2.id')
            ->select('reimbursements.*', 'u1.name as submitted_by_name', 'u2.name as responded_by_name')
            ->get();
            return response()->json([
                'code'      => 200,
                'data'      => $data
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'code'      => 400,
                'message'   => "Internal server error"
            ], 500);
        }
    }
    public function create(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'submitted_date'      => 'required|date',
                'description'         => 'required|string',
                'supporting_file'     => 'required|mimes:pdf|max:10240',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'code'      => 400,
                    'errors'    => $validator->errors()
                ], 200);
            }
    
            $user = $request->attributes->get('user');
            $pdfFile = $request->file('supporting_file');
            $targetPath = public_path('files'); 
            if(!is_dir($targetPath)) {
                mkdir($targetPath, 0755, true);
            }
            
            $fileName = Str::uuid();
            
            
            if($user['role'] != 'staff') {
                return response()->json([
                    'code'      => 403,
                    'errors'    => "Anda tidak memiliki akses untuk membuat reimbursements"
                ], 200);
            }
            $fileName = $user['id'] . '_' . Str::uuid() . '_' . time() . '.pdf';
            $dbFileName = '/files/' . $fileName;
            Reimbursement::create([
                'id'                => (string) Str::uuid(),
                'submitted_by'      => $user['id'],
                'submitted_date'    => $request->submitted_date,
                'description'       => $request->description,
                'supporting_file'   => $dbFileName
            ]);
            $pdfFile->move($targetPath, $fileName);
            return response()->json([
                'code'      => 200,
                'message'   => "Berhasil mengajukan reimbursement"
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error"
            ], 500);
        }
    }

    public function approve(Request $request, String $id) {
        try {
            $user = $request->attributes->get('user');
            
            if($user['role'] == 'staff') {
                return response()->json([
                    'code'      => 403,
                    'message'   => "Anda tidak memiliki akses untuk menyetujui reimbursements"
                ], 200);
            }
            $reimbursement = new Reimbursement();
            $data = $reimbursement->where('id', $id)
            ->first();
            if(empty($data)) {
                return response()->json([
                    'code'      => 404,
                    'message'   => "Reimbursement tidak ditemukan"
                ], 200);
            }
            $data = $data->toArray();
            if(!empty($data['responded_status'])) {
                return response()->json([
                    'code'      => 403,
                    'message'   => $data['responded_status'] == 'approved' ? "Reimbursement sudah disetujui" : "Reimbursement sudah ditolak"
                ], 200);
            }
            $reimbursement->where('id', $id)
            ->update([
                'responded_by'      => $user['id'],
                'responded_date'    => date('Y-m-d H:i:s'),
                'responded_status'  => 'approved'
            ]);
            return response()->json([
                'code'      => 200,
                'message'   => "Reimbursement disetujui"
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error"
            ], 500);
        }
    }

    public function reject(Request $request, String $id) {
        try {
            $user = $request->attributes->get('user');
            if($user['role'] == 'staff') {
                return response()->json([
                    'code'      => 403,
                    'message'   => "Anda tidak memiliki akses untuk menolak reimbursements"
                ], 200);
            }
            $reimbursement = new Reimbursement();
            $data = $reimbursement->where('id', $id)
            ->first();
            if(empty($data)) {
                return response()->json([
                    'code'      => 404,
                    'message'   => "Reimbursement tidak ditemukan"
                ], 200);
            }
            $data = $data->toArray();
            if(!empty($data['responded_status'])) {
                return response()->json([
                    'code'      => 403,
                    'errors'    => $data['responded_status'] == 'approved' ? "Reimbursement sudah disetujui" : "Reimbursement sudah ditolak"
                ], 200);
            }
            $reimbursement->where('id', $id)
            ->update([
                'responded_by'      => $user['id'],
                'responded_date'    => date('Y-m-d H:i:s'),
                'responded_status'  => 'rejected'
            ]);
            return response()->json([
                'code'      => 200,
                'message'   => "Reimbursement ditolak"
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error",
            ], 500);
        }
    }
}