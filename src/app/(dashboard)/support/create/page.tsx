"use client";

import React, { useRef, useState } from "react";
import IconSelectBox from "@/components/common/IconSelectBox";
import LoaderButton from "@/components/common/LoaderButton";
import IconField from "@/components/common/IconField";
import { Add, Mail } from "@mui/icons-material";
import { getUrlOrObjectUrl } from "@/utils/getImageSrcType";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { createPrivateTicketApi } from "@/services/support";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";

import { Role } from "@/constants/roles";

const supportOptions = [
  { label: "Incident", value: "Incident" },
  { label: "Question", value: "Question" },
  { label: "Problem", value: "Problem" },
  { label: "Refund", value: "Refund" },
  { label: "Transaction Issue", value: "Transaction Issue" },
  { label: "Loan", value: "Loan" },
];

const Support = () => {
  const front = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useLocalStorage("user");
  const [isTicketLoading, isTicketError, callCreateTicketApi] = useApi();
  const [supportData, setSupportData] = useState({
    subject: "",
    concern: "",
    message: "",
    attachments: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupportData((pre) => ({ ...pre, [name]: value }));
  };

  const handlefileChange = (e) => {
    const { name, files } = e.target;
    if (supportData?.attachments) {
      let filesMerged = [...supportData?.attachments, ...files];
      setSupportData((pre) => ({ ...pre, [name]: Array.from(filesMerged) }));
    } else {
      setSupportData((pre) => ({ ...pre, [name]: Array.from(files) }));
    }
  };

  const createTicketHandler = async () => {
    const formdata = new FormData();

    formdata.append("email", user?.email);
    formdata.append("name", `${user?.first_name} ${user?.last_name}`);
    formdata.append("message", supportData?.message);
    formdata.append("subject", supportData?.subject);
    formdata.append("type", supportData?.concern);

    supportData?.attachments?.forEach((file: File) =>
      formdata.append("files", file)
    );

    await callApiHook({
      apiCall: callCreateTicketApi(createPrivateTicketApi(formdata)),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Your request has been sent Successfully",
            status: "success",
          })
        );
        router.push("/");
      },
    });
  };

  return (
    <>
      <div className="rounded-medium flex flex-col  bg-white p-10 shadow-sm">
        <h3 className="text-h3.5 font-semibold text-blackGrey-100 mb-12">
          Need Help
        </h3>

        <div className="grid grid-cols-2 gap-x-10 flex-wrap mb-2">
          <IconField
            value={`${user?.first_name} ${user?.last_name}`}
            label="Name"
            disabled
            icon={Mail}
            onChange={handleChange}
            name="name"
          />
          <IconField
            value={user?.email}
            icon={Mail}
            label="Email"
            disabled
            onChange={handleChange}
            name="email"
          />
        </div>

        <IconField
          onChange={handleChange}
          label="Subject"
          name="subject"
          placeholder="Enter your Subject"
          inputContainerClassName="!bg-blackGrey-filled-input mb-2"
          value={supportData.subject}
        />

        <IconSelectBox
          options={supportOptions}
          onChange={handleChange}
          label="Concern"
          name="concern"
          placeholder="Select your Concern"
          inputContainerClassName="!bg-blackGrey-filled-input mb-2"
          value={supportData.concern}
        />

        <div className="flex flex-col gap-2 mb-8">
          <label className="block mb-1 font-medium">Message</label>

          <textarea
            value={supportData?.message}
            placeholder="Your Message Here"
            onChange={handleChange}
            name="message"
            className={`border border-light-gray p-4 resize-none text-gray-400 font-medium w-full min-h-36 rounded-medium bg-light-gray outline-none`}
          />
        </div>

        {/* <div className="flex gap-4 items-center mt-20 flex-wrap mb-8">
        <div className="max-w-full w-[310px]">
        <LoaderButton content="Contact Support" variant="contained" />
        </div>
        </div> */}
      </div>

      <div className="rounded-medium flex flex-col mt-10 bg-white p-10 shadow-sm">
        <h3 className="text-h3.5 font-semibold text-blackGrey-100 mb-12">
          Upload Attachments
        </h3>

        <div className="flex flex-col gap-2">
          <input
            type="file"
            multiple
            name="attachments"
            onChange={handlefileChange}
            ref={front}
            hidden
            accept="image/*"
          />
          <p className="my-2 font-semibold text-input text-black-100">Images</p>
          {!supportData?.attachments ? (
            <div className="flex flex-col gap-3 items-start justify-center mb-2">
              <button
                type="button"
                className="border w-[470px] max-w-full justify-center border-light-gray border-dashed bg-blackGrey-filled-input p-3 px-8 rounded-full flex items-center gap-2"
                onClick={() => front?.current?.click()}
              >
                <Add className="text-purple-100" />
                <span className="text-blackGrey-placeholder text-input">
                  Drop Files Here Or Click To Upload
                </span>
              </button>
            </div>
          ) : (
            <div className="flex gap-6 flex-wrap">
              {supportData?.attachments?.map((item) => (
                <div className="text-center flex flex-col gap-2 w-[320px]">
                  <img
                    src={getUrlOrObjectUrl(item)}
                    alt="front side"
                    className="max-w-full object-contain"
                  />
                  <span className="text-caption text-custom-title-gray font-medium">
                    {item?.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {supportData?.attachments && (
          <div className="mt-12 max-w-[220px]">
            <LoaderButton
              content={"Upload Image"}
              variant={"outlined"}
              onClick={() => front?.current?.click()}
            />
          </div>
        )}
      </div>

      <ErrorApiText error={isTicketError} />

      <div className="mt-16 max-w-[360px] pb-8">
        <LoaderButton
          loading={isTicketLoading}
          content={"Submit"}
          onClick={createTicketHandler}
          type="submit"
          variant={"contained"}
        />
      </div>
    </>
  );
};

export default Support;
