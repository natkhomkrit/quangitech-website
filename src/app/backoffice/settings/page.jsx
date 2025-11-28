"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Loader2, Camera, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export default function SiteSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    siteName: "",
    siteUrl: "",
    logoUrl: "",
    description: "",
    seoKeywords: "",
  });

  // Edit states
  const [isPersonalOpen, setIsPersonalOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Cropping states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  useEffect(() => {
    fetchUser();
    fetchSettings();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/users/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
          themeColor: data.themeColor || "#000000",
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update settings");

      toast.success("Settings updated successfully");
      router.refresh(); // Refresh to apply theme color
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    }
  };

  const openEdit = (type) => {
    if (!user) return;
    setEditForm({
      fullName: user.fullName || "",
      firstName: user.firstName || (user.fullName ? user.fullName.split(" ")[0] : ""),
      lastName: user.lastName || (user.fullName && user.fullName.split(" ").length > 1 ? user.fullName.split(" ").slice(1).join(" ") : ""),
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      country: user.country || "",
      province: user.province || "",
      district: user.district || "",
      subDistrict: user.subDistrict || "",
      postalCode: user.postalCode || "",
    });
    if (type === "personal") setIsPersonalOpen(true);
    if (type === "address") setIsAddressOpen(true);
    if (type === "profile") setIsProfileOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser = await res.json();
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      setIsPersonalOpen(false);
      setIsAddressOpen(false);
      setIsProfileOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(tempImage, croppedAreaPixels);
      const file = new File([croppedImageBlob], "logo.png", { type: "image/png" });

      const uploadData = new FormData();
      uploadData.append("file", file);

      const toastId = toast.loading("Uploading logo...");
      const res = await fetch("/api/images", { method: "POST", body: uploadData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setFormData((prev) => ({ ...prev, logoUrl: data.location }));
      toast.dismiss(toastId);
      toast.success("Logo uploaded");
      setIsCropping(false);
      setTempImage(null);
      setZoom(1);
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop/upload image");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Don't set global loading, maybe just a toast or local state?
      // For now, just toast
      const uploadToast = toast.loading("Uploading image...");

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const newAvatarUrl = data.location;

      // Update user avatar
      const updateRes = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: newAvatarUrl }),
      });

      if (!updateRes.ok) throw new Error("Failed to update user profile");

      setUser((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
      toast.dismiss(uploadToast);
      toast.success("Profile picture updated");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Failed to upload image");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="account" className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1">
            <TabsTrigger
              value="account"
              className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-semibold font-medium transition-colors hover:bg-muted/50"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="site"
              className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-semibold font-medium transition-colors hover:bg-muted/50"
            >
              Site
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-semibold font-medium transition-colors hover:bg-muted/50"
            >
              Appearance
            </TabsTrigger>
          </TabsList>
        </aside>
        <div className="flex-1">

          {/* General Settings */}
          <TabsContent value="account" className="px-6 py-6">
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-semibold">My Profile</h2>

              {/* Profile Header */}
              <div className="p-6 flex items-center gap-6 justify-between rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Avatar className="w-20 h-20 border-2 border-white shadow-sm cursor-pointer">
                      <AvatarImage src={user?.avatarUrl || "https://github.com/shadcn.png"} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {user?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer text-white"
                    >
                      <Camera size={20} />
                    </label>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{user?.fullName || "No Name"}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role || "User"}</p>
                  </div>
                </div>
                <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => openEdit("profile")}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>Update your display name.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={editForm.fullName || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdateUser}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Personal Information */}
              <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <Dialog open={isPersonalOpen} onOpenChange={setIsPersonalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openEdit("personal")}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edit Personal Information</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={editForm.firstName || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={editForm.lastName || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            value={editForm.email || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={editForm.phone || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleUpdateUser}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <small className="text-muted-foreground block mb-1">First Name</small>
                    <p className="font-medium">{user?.firstName || (user?.fullName ? user.fullName.split(" ")[0] : "-")}</p>
                  </div>
                  <div>
                    <small className="text-muted-foreground block mb-1">Last Name</small>
                    <p className="font-medium">{user?.lastName || (user?.fullName && user.fullName.split(" ").length > 1 ? user.fullName.split(" ").slice(1).join(" ") : "-")}</p>
                  </div>
                  <div>
                    <small className="text-muted-foreground block mb-1">E-mail</small>
                    <p className="font-medium">{user?.email || "-"}</p>
                  </div>
                  <div>
                    <small className="text-muted-foreground block mb-1">Phone</small>
                    <p className="font-medium">{user?.phone || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Address</h3>
                  <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openEdit("address")}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              name="country"
                              value={editForm.country || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="province">Province</Label>
                            <Input
                              id="province"
                              name="province"
                              value={editForm.province || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="district">District</Label>
                            <Input
                              id="district"
                              name="district"
                              value={editForm.district || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="subDistrict">Sub District</Label>
                            <Input
                              id="subDistrict"
                              name="subDistrict"
                              value={editForm.subDistrict || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={editForm.postalCode || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleUpdateUser}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <small className="text-muted-foreground block mb-1">Country</small>
                    <p className="font-medium">{user?.country || "-"}</p>
                  </div>
                  <div>
                    <small className="text-muted-foreground block mb-1">Province</small>
                    <p className="font-medium">{user?.province || "-"}</p>
                  </div>
                  <div>
                    <small className="text-muted-foreground block mb-1">District</small>
                    <p className="font-medium">{user?.district || "-"}</p>
                  </div>
                  <div>
                    <small className="text-muted-foreground block mb-1">Sub District</small>
                    <p className="font-medium">{user?.subDistrict || "-"}</p>
                  </div>
                  <div>
                    <small className="text-muted-foreground block mb-1">Postal Code</small>
                    <p className="font-medium">{user?.postalCode || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Site Settings */}
          <TabsContent value="site" className="pt-6 px-6">
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-6 p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="relative group">
                  <div className="min-w-[150px] min-h-[150px] max-w-[300px] rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50 p-2 relative">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Site Logo"
                        className="max-w-full max-h-[200px] object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Camera size={32} />
                        <span className="text-xs">Upload Logo</span>
                      </div>
                    )}

                    <label
                      htmlFor="logo-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium"
                    >
                      Change Logo
                    </label>
                  </div>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.addEventListener("load", () => {
                        setTempImage(reader.result);
                        setIsCropping(true);
                        setZoom(1);
                      });
                      reader.readAsDataURL(file);
                      e.target.value = null;
                    }}
                  />

                  <Dialog open={isCropping} onOpenChange={setIsCropping}>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Crop Logo</DialogTitle>
                        <DialogDescription>
                          Adjust the image to fit the circle.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative w-full h-[400px] bg-black/5 rounded-md overflow-hidden">
                        <Cropper
                          image={tempImage}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          cropShape="round"
                          showGrid={false}
                        />
                      </div>
                      <div className="flex items-center gap-4 py-2">
                        <ZoomOut size={16} />
                        <input
                          type="range"
                          value={zoom}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <ZoomIn size={16} />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCropping(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCropSave}>Save Logo</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Site Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 512x512px. Max file size: 2MB.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={formData.siteName || ""}
                      onChange={handleChange}
                      placeholder="e.g. Quangitech"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      name="siteUrl"
                      value={formData.siteUrl || ""}
                      onChange={handleChange}
                      placeholder="e.g. https://www.quangitech.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Meta Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Brief description of your website for SEO"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="seoKeywords">SEO Keywords</Label>
                    <Input
                      id="seoKeywords"
                      name="seoKeywords"
                      value={formData.seoKeywords || ""}
                      onChange={handleChange}
                      placeholder="e.g. technology, software, innovation (comma separated)"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="pt-6 px-6">
            <form className="max-w-md space-y-4" onSubmit={handleSettingsSubmit}>
              <div className="space-y-2">
                <Label htmlFor="themeColor">Theme Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="themeColor"
                    name="themeColor"
                    type="color"
                    value={formData.themeColor}
                    onChange={handleChange}
                    className="h-10 w-20 p-1"
                  />
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, themeColor: "#03172C" })}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
