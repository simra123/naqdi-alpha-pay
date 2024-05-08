import React from "react";

type Props = {
  user: any;
  allowedRoles: string[];
  children: any;
};

const RenderRoleBased = ({ user, allowedRoles, children }: Props) => {
  return allowedRoles.includes(user.role) && children;
};

export default RenderRoleBased;
