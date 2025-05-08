"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setUser, setLoading, setError } from "../../redux/reducer/userSlice";
import { fetchUserProfile, updateUserProfile } from "../../../services/userService";
import { UserProfile } from "../../../types/user";
import { Card } from "../../components/profile/ui/card";
import { Input } from "../../components/profile/ui/input";
import { RadioGroup, RadioGroupItem } from "../../components/profile/ui/radio-group";
import { Label } from "../../components/profile/ui/label";
import { Button } from "../../components/profile/ui/button";
import Head from "next/head";

export default function ProfileInformationPage() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [form, setForm] = useState<UserProfile | null>(null);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUserProfile()
      .then((data) => {
        dispatch(setUser(data));
        setForm(data);
      })
      .catch((err) => dispatch(setError(err.message)));
  }, [dispatch]);

  const handleEdit = (section) => setEditSection(section);
  const handleCancel = () => {
    setEditSection(null);
    setForm(profile);
  };
  const handleChange = (e) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleGenderChange = (value) => {
    if (!form) return;
    setForm({ ...form, gender: value });
  };
  const handleSave = async () => {
    if (!form) return;
    dispatch(setLoading(true));
    try {
      const updated = await updateUserProfile(form);
      dispatch(setUser(updated));
      setEditSection(null);
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <>
      <Head>
        <title>Profile Information | My E-Commerce</title>
        <meta name="description" content="Manage your profile information." />
      </Head>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Input
              name="firstName"
              value={form?.firstName || ""}
              onChange={handleChange}
              className="bg-gray-50"
              disabled={editSection !== "name"}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="lastName"
              value={form?.lastName || ""}
              onChange={handleChange}
              className="bg-gray-50"
              disabled={editSection !== "name"}
            />
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          {editSection !== "name" ? (
            <Button variant="ghost" className="text-blue-600" onClick={() => handleEdit("name")}>Edit</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button variant="default" onClick={handleSave} disabled={loading}>Save</Button>
            </>
          )}
        </div>
        <div className="mt-6">
          <p className="mb-4">Your Gender</p>
          <RadioGroup
            value={form?.gender || "male"}
            onValueChange={handleGenderChange}
            className="flex space-x-6"
            disabled={editSection !== "gender"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
          {editSection !== "gender" ? (
            <Button variant="ghost" className="text-blue-600 ml-2" onClick={() => handleEdit("gender")}>Edit</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button variant="default" onClick={handleSave} disabled={loading}>Save</Button>
            </>
          )}
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Email Address</h2>
            {editSection !== "email" ? (
              <Button variant="ghost" className="text-blue-600" onClick={() => handleEdit("email")}>Edit</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button variant="default" onClick={handleSave} disabled={loading}>Save</Button>
              </>
            )}
          </div>
          <Input
            name="email"
            value={form?.email || ""}
            onChange={handleChange}
            className="bg-gray-50"
            disabled={editSection !== "email"}
          />
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Mobile Number</h2>
            {editSection !== "mobile" ? (
              <Button variant="ghost" className="text-blue-600" onClick={() => handleEdit("mobile")}>Edit</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button variant="default" onClick={handleSave} disabled={loading}>Save</Button>
              </>
            )}
          </div>
          <Input
            name="mobile"
            value={form?.mobile || ""}
            onChange={handleChange}
            className="bg-gray-50"
            disabled={editSection !== "mobile"}
          />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">FAQs</h2>
          {/* Add FAQ content here if needed */}
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </Card>
    </>
  );
} 