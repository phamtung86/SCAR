import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FeeAPI from "@/lib/api/fee";
import { getCurrentUser } from "@/lib/utils/get-current-user";
import { formatDateToDate } from "@/lib/utils/time-format";
import { FeeCRUDForm, FeeDTO, FeeTypeNameDTO } from "@/types/fee";
import {
    DollarSign,
    Pencil,
    Plus,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const SystemFeesManager = () => {
    const [fees, setFees] = useState<FeeDTO[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState<FeeDTO | null>(null);
    const currentUser = getCurrentUser();
    const [feeTypesAndFeeTypeNames, setFeeTypesAndFeeTypeNames] = useState<FeeTypeNameDTO[]>([]);
    const [feeCodes, setFeeCodes] = useState<String[]>([])
    const [formData, setFormData] = useState({
        name: "",
        icon: "",
        code: "",
        type: "",
        price: "",
        sale: "",
        expirySale: "",
        creator: {
            id: 0,
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            profilePicture: "",
            createdAt: "",
            updatedAt: "",
            role: "",
            status: "",
            verified: true,
            bio: "",
            location: "",
            phone: "",
            fullName: "",
            rating: 0,
            rank: "",
            registerRankAt: "",
            expiryRankAt: "",
            accountStatus: "",
        },
        feeServiceDetails: [{
            id: 0,
            name: "",
            feeId: 0,
            feeCode: ""
        }]
    });

    const getFeeCodes = (listFee : FeeDTO[]) => {
        const codes = listFee.map(item => item.code);
        setFeeCodes(codes);
    };


    const fetchFeesSystem = async () => {
        try {
            const res = await FeeAPI.getAllFees();
            if (res.status === 200) {
                setFees(res.data);
                getFeeCodes(res.data);
            }
        } catch (error) {
            console.error("Error fetching system fees", error);
            toast.error("Lỗi khi tải danh sách phí");
        }
    };

    const fetchFeeTypeAndFeeTypeName = async () => {
        try {
            const res = await FeeAPI.getTypesAndTypeNames();
            if (res.status === 200) {
                console.log(res.data);

                setFeeTypesAndFeeTypeNames(res.data)
            }
        } catch (error) {
            console.log("Error fetching fee types and fee type names: ", error);

        }
    }

    useEffect(() => {
        fetchFeesSystem();
        fetchFeeTypeAndFeeTypeName();
    }, []);

    const handleAdd = async () => {
        console.log(formData);
        
        // console.log("aaaaa", formData);
        
        if (!formData.name || !formData.code || !formData.type || !formData.price) {
            console.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        const newFee: FeeCRUDForm = {
            name: formData.name,
            icon: formData.icon || "DollarSign",
            code: formData.code,
            type: formData.type,
            price: parseFloat(formData.price),
            sale: parseFloat(formData.sale) || 0,
            expirySale: formData.expirySale ? new Date(formData.expirySale).toISOString() : "",
            creatorId: Number(currentUser?.id),
            feeServiceDetailName: formData.feeServiceDetails.map(detail => detail.name)
        };

        try {
            const res = await FeeAPI.createNewFees(newFee);
            if (res.status === 201) {
                setFees([...fees, res.data]);
                setFormData({
                    name: "",
                    icon: "",
                    code: "",
                    type: "",
                    price: "",
                    sale: "",
                    expirySale: "",
                    creator: formData.creator,
                    feeServiceDetails: []
                });
                setIsAddDialogOpen(false);
                toast.success("Đã thêm phí hệ thống mới");
            }
        } catch (error) {
            console.error("Error adding fee", error);
            toast.error("Lỗi khi thêm phí mới");
        }
    };

    const handleEdit = async () => {
        if (!selectedFee || !formData.name || !formData.code || !formData.type || !formData.price) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        const updatedFeeData: FeeCRUDForm = {
            name: formData.name,
            icon: formData.icon || "DollarSign",
            code: formData.code,
            type: formData.type,
            price: parseFloat(formData.price),
            sale: parseFloat(formData.sale) || 0,
            expirySale: formData.expirySale ? new Date(formData.expirySale).toISOString() : "",
            creatorId: selectedFee.creator.id,
            feeServiceDetailName: formData.feeServiceDetails.map(detail => detail.name)
        };

        try {
            const res = await FeeAPI.updateFee(selectedFee.id, updatedFeeData);
            if (res.status === 200) {
                setFees(fees.map((fee) => fee.id === selectedFee.id ? res.data : fee));
                setIsEditDialogOpen(false);
                setSelectedFee(null);
                setFormData({
                    name: "",
                    icon: "",
                    code: "",
                    type: "",
                    price: "",
                    sale: "",
                    expirySale: "",
                    creator: formData.creator,
                    feeServiceDetails: []
                });
                toast.success("Đã cập nhật phí hệ thống");
            }
        } catch (error) {
            console.error("Error updating fee", error);
            toast.error("Lỗi khi cập nhật phí");
        }
    };

    const handleDelete = async () => {
        if (!selectedFee) return;

        try {
            await FeeAPI.deleteById(selectedFee.id);
            setFees(fees.filter((fee) => fee.id !== selectedFee.id));
            setIsDeleteDialogOpen(false);
            setSelectedFee(null);
            toast.success("Đã xóa phí hệ thống");
        } catch (error) {
            console.error("Error deleting fee", error);
            toast.error("Lỗi khi xóa phí");
        }
    };

    const openEditDialog = (fee: FeeDTO) => {
        setSelectedFee(fee);
        setFormData({
            name: fee.name,
            icon: fee.icon,
            code: fee.code,
            type: fee.type,
            price: fee.price.toString(),
            sale: fee.sale.toString(),
            expirySale: fee.expirySale ? new Date(fee.expirySale).toISOString().split('T')[0] : "",
            creator: fee.creator,
            feeServiceDetails: fee.feeServiceDetails
        });
        setIsEditDialogOpen(true);
    };
    const openDeleteDialog = (fee: FeeDTO) => {
        setSelectedFee(fee);
        setIsDeleteDialogOpen(true);
    };

    const handleFeeServiceDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const details = e.target.value.split(',').map((name, index) => ({
            id: index + 1,
            name: name.trim(),
            feeId: selectedFee?.id || 0,
            feeCode: formData.code
        }));
        setFormData({ ...formData, feeServiceDetails: details });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Quản lý phí hệ thống</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Quản lý các loại phí áp dụng cho người dùng
                    </p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm phí mới
                </Button>
            </div>

            <div className="grid gap-4">
                {fees.map((fee) => (
                    <Card key={fee?.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-foreground">{fee?.name}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                                                {fee?.code}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded bg-secondary/10 text-secondary-foreground">
                                                {fee?.type}
                                            </span>
                                        </div>
                                        {fee?.feeServiceDetails?.map(item => (
                                            <p key={item.id} className="text-sm text-muted-foreground mt-1">
                                                {item.name}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-success">
                                            {fee?.price.toLocaleString('vi-VN')} VNĐ
                                        </p>
                                        {fee?.sale > 0 && (
                                            <p className="text-sm text-warning">
                                                Giảm {fee?.sale}%
                                                {fee?.expirySale && ` đến ${formatDateToDate(fee?.expirySale)}`}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(fee)}
                                            className="gap-2"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => openDeleteDialog(fee)}
                                            className="gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm phí hệ thống mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin phí hệ thống mới
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên dịch vụ *</Label>
                            <Input
                                id="name"
                                placeholder="VD: Đăng tin thường"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon</Label>
                            <Input
                                id="icon"
                                placeholder="VD: FileText"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Mã *</Label>
                            <select
                                id="edit-type"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Chọn mã</option>
                                {feeCodes?.map((item, index) => (
                                    <option value={String(item)} key={index}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Loại *</Label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Chọn loại</option>
                                {feeTypesAndFeeTypeNames?.map((item, index) => (
                                    <option value={item?.type} key={index}>{item.typeName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Giá *</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="VD: 20000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sale">Giảm giá (%)</Label>
                            <Input
                                id="sale"
                                type="number"
                                placeholder="VD: 10"
                                value={formData.sale}
                                onChange={(e) => setFormData({ ...formData, sale: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expirySale">Ngày hết hạn giảm giá</Label>
                            <Input
                                id="expirySale"
                                type="date"
                                value={formData.expirySale}
                                onChange={(e) => setFormData({ ...formData, expirySale: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feeServiceDetails">Chi tiết dịch vụ (ngăn cách bằng dấu phẩy)</Label>
                            <Input
                                id="feeServiceDetails"
                                placeholder="VD: Đăng tin xe máy, Đăng tin ô tô"
                                onChange={handleFeeServiceDetailsChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleAdd}>Thêm mới</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa phí hệ thống</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin phí hệ thống
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Tên dịch vụ *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-icon">Icon</Label>
                            <Input
                                id="edit-icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-code">Mã *</Label>
                            <select
                                id="edit-type"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Chọn mã</option>
                                {feeCodes?.map((item, index) => (
                                    <option value={String(item)} key={index}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Loại *</Label>
                            <select
                                id="edit-type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Chọn loại</option>
                                {feeTypesAndFeeTypeNames?.map((item, index) => (
                                    <option value={item?.type} key={index}>{item.typeName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Giá *</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sale">Giảm giá (%)</Label>
                            <Input
                                id="edit-sale"
                                type="number"
                                value={formData.sale}
                                onChange={(e) => setFormData({ ...formData, sale: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-expirySale">Ngày hết hạn giảm giá</Label>
                            <Input
                                id="edit-expirySale"
                                type="date"
                                value={formData.expirySale}
                                onChange={(e) => setFormData({ ...formData, expirySale: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-feeServiceDetails">Chi tiết dịch vụ (ngăn cách bằng dấu phẩy)</Label>
                            <Input
                                id="edit-feeServiceDetails"
                                value={formData.feeServiceDetails.map(detail => detail.name).join(', ')}
                                onChange={handleFeeServiceDetailsChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleEdit}>Cập nhật</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa phí "{selectedFee?.name}"? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};