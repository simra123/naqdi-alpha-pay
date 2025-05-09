"use client";

import React, { useRef, useState } from "react";
import IconSelectBox from "@/components/common/IconSelectBox";
import LoaderButton from "@/components/common/LoaderButton";
import IconField from "@/components/common/IconField";
import { MdAdd, MdClose, MdEmail } from "react-icons/md";
import { getUrlOrObjectUrl } from "@/utils/getImageSrcType";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { createPrivateTicketApi } from "@/services/support";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import useFormValidation from "@/hooks/useFormValidation";
import { supportOptions } from "@/constants/types";
import supportSchema from "@/models/support";

const initialValues = {
  subject: "",
  concern: "",
  message: "",
  attachments: null,
};

const Support = () => {
  const front = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useLocalStorage("user");
  const [isTicketLoading, isTicketError, callCreateTicketApi] = useApi();

  const {
    errors,
    handleChange,
    handleSubmit,
    validateField,
    values,
    setValues,
  } = useFormValidation(initialValues, supportSchema);

  const handlefileChange = (e) => {
    const { name, files } = e.target;
    if (values?.attachments) {
      let filesMerged = [...values?.attachments, ...files];
      setValues((pre) => ({ ...pre, [name]: Array.from(filesMerged) }));
    } else {
      setValues((pre) => ({ ...pre, [name]: Array.from(files) }));
    }
  };

  const handleRemoveFile = (index) => {
    setValues((pre) => {
      const updatedAttachments = pre.attachments.filter((_, i) => i !== index);
      return {
        ...pre,
        attachments: updatedAttachments.length > 0 ? updatedAttachments : null,
      };
    });
  };

  const createTicketHandler = async () => {
    const formdata = new FormData();

    formdata.append("email", user?.email);
    formdata.append("name", `${user?.first_name} ${user?.last_name}`);
    formdata.append("message", values?.message);
    formdata.append("subject", values?.subject);
    formdata.append("type", values?.concern);

    values?.attachments?.forEach((file: File) =>
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
      <form
        onSubmit={(event) =>
          handleSubmit(event, createTicketHandler, () =>
            console.log("Error Validating Form")
          )
        }
      >
        <div className="flex flex-col rounded-medium">
          <h3 className="mb-12 font-semibold text-blackGrey-100 text-h3.5">
            Need Help
          </h3>

          <div className="flex-wrap gap-x-10 grid grid-cols-2 mb-2">
            <IconField
              value={`${user?.first_name} ${user?.last_name}`}
              label="Name"
              disabled
              icon={MdEmail}
              onChange={handleChange}
              name="name"
            />
            <IconField
              value={user?.email}
              icon={MdEmail}
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
            error={errors?.subject}
            onBlur={validateField}
            placeholder="Enter your Subject"
            inputContainerClassName="!bg-blackGrey-filled-input mb-2"
            value={values.subject}
          />

          <IconSelectBox
            options={supportOptions}
            onChange={handleChange}
            label="Type"
            error={errors?.concern}
            name="concern"
            placeholder="Select your Concern"
            inputContainerClassName="!bg-blackGrey-filled-input mb-2"
            value={values.concern}
          />

          <div className="flex flex-col gap-2 mb-8">
            <label className="block mb-1 font-medium">Message</label>

            <textarea
              value={values?.message}
              onBlur={validateField}
              placeholder="Your Message Here"
              onChange={handleChange}
              name="message"
              className={`border border-light-gray p-4 resize-none text-gray-400 font-medium w-full min-h-36 rounded-medium bg-light-gray outline-none`}
            />

            {errors.message && (
              <p className="mt-[4px] ml-4 text-red-error-dark text-subtitle">
                {errors.message}
              </p>
            )}
          </div>

          {/* <div className="flex flex-wrap items-center gap-4 mt-20 mb-8">
        <div className="w-[310px] max-w-full">
        <LoaderButton content="Contact Support" variant="contained" />
        </div>
        </div> */}
        </div>

        <div className="flex flex-col mt-10 rounded-medium">
          <h3 className="mb-12 font-semibold text-blackGrey-100 text-h3.5">
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
            <p className="my-2 font-semibold text-black-100 text-input">
              Images
            </p>
            {!values?.attachments ? (
              <div className="flex flex-col justify-center items-start gap-3 mb-2">
                <button
                  type="button"
                  className="flex justify-center items-center gap-2 bg-blackGrey-filled-input p-3 px-8 border border-light-gray border-dashed rounded-full w-[470px] max-w-full"
                  onClick={() => front?.current?.click()}
                >
                  <MdAdd className="text-purple-500" />
                  <span className="text-blackGrey-placeholder text-input">
                    Drop Files Here Or Click To Upload
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {/* {supportData?.attachments?.map((item) => (
                <div className="flex flex-col gap-2 w-[320px] text-center">
                <img
                src={getUrlOrObjectUrl(item)}
                alt="front side"
                className="max-w-full object-contain"
                />
                <span className="font-medium text-caption text-custom-title-gray">
                {item?.name}
                </span>
                </div>
                ))} */}
                {values?.attachments?.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col gap-2 w-[320px] text-center"
                  >
                    <img
                      src={getUrlOrObjectUrl(item)}
                      alt="attachment"
                      className="max-w-full object-contain"
                    />
                    <span className="font-medium text-caption">
                      {item.name}
                    </span>
                    <button
                      className="top-0 right-0 absolute bg-red-500 p-1 rounded-full text-white"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {values?.attachments && (
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

        <div className="mt-16 pb-8 max-w-[360px]">
          <LoaderButton
            loading={isTicketLoading}
            content={"Submit"}
            type="submit"
            variant={"contained"}
          />
        </div>
      </form>
    </>
  );
};

export default Support;
