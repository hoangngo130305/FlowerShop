import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Star, Camera, Trash2, Image as ImageIcon } from 'lucide-react';

interface ReviewFormProps {
  productTitle: string;
  onSubmit: (data: {
    name: string;
    rating: number;
    comment: string;
    product: string;
    images: File[];
  }) => void;
  onCancel: () => void;
}

const ReviewForm = ({ productTitle, onSubmit, onCancel }: ReviewFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    product: productTitle, // Initialize with productTitle
    images: [] as File[]
  });

  // Update product when productTitle changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      product: productTitle
    }));
  }, [productTitle]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleRatingChange = useCallback((rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} không phải là hình ảnh.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn. Vui lòng chọn file nhỏ hơn 5MB.`);
        return false;
      }
      return true;
    });

    setFormData(prev => {
      const currentImages = prev.images;
      const totalImages = currentImages.length + validFiles.length;
      
      if (totalImages > 3) {
        alert('Chỉ được upload tối đa 3 hình ảnh.');
        return prev;
      }

      return {
        ...prev,
        images: [...prev.images, ...validFiles]
      };
    });

    // Reset input value
    e.target.value = '';
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl font-bold text-center">
          Đánh giá {productTitle}
        </CardTitle>
        <CardDescription className="text-center">
          Chia sẻ trải nghiệm của bạn để giúp khách hàng khác
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <label htmlFor="review-name" className="text-sm font-medium">
                Họ tên *
              </label>
              <Input 
                id="review-name"
                name="name"
                placeholder="Nguyễn Văn A" 
                value={formData.name}
                onChange={handleFormChange}
                required
                autoComplete="off"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sản phẩm đang xem
              </label>
              <Input 
                value={productTitle}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Đánh giá *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => handleRatingChange(rating)}
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${
                      rating <= formData.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 hover:text-yellow-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({formData.rating} sao)
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="review-comment" className="text-sm font-medium">
              Nội dung đánh giá *
            </label>
            <Textarea 
              id="review-comment"
              name="comment"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="min-h-[100px]"
              value={formData.comment}
              onChange={handleFormChange}
              required
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Thêm hình ảnh (không bắt buộc)
            </label>
            <p className="text-xs text-muted-foreground">
              Tối đa 3 ảnh, mỗi ảnh dưới 5MB. Định dạng: JPG, PNG, GIF
            </p>
            
            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                id="review-images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={formData.images.length >= 3}
              />
              <label
                htmlFor="review-images"
                className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                  formData.images.length >= 3
                    ? 'border-muted bg-muted/50 cursor-not-allowed text-muted-foreground'
                    : 'border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-primary'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {formData.images.length >= 3 ? 'Đã đủ 3 ảnh' : 'Chọn ảnh để tải lên'}
                </span>
              </label>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((file, index) => (
                  <div key={`${file.name}-${file.lastModified}-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#FF7BBF] to-[#FF4D91] text-white hover:shadow-lg transition-shadow"
            >
              <Star className="w-4 h-4 mr-2" />
              Gửi đánh giá
            </Button>
            <Button 
              type="button"
              variant="outline"
              className="flex-1 hover:bg-muted"
              onClick={onCancel}
            >
              Hủy
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

ReviewForm.displayName = 'ReviewForm';

export default ReviewForm;
