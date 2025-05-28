import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaLock, FaCheckCircle, FaDownload } from "react-icons/fa";
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  Card,
  EmptyState,
  ActionButton,
} from "../../../styles/GlobalComponents";
import { colors, spacing, typography } from "../../../styles/GlobalTheme";

const MilestoneDelivery = ({ milestones = [] }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!milestones.length) {
    return (
      <PanelContainer dir={isRTL ? "rtl" : "ltr"}>
        <PanelHeader>
          <PanelTitle>
            {t("invoices.milestoneDelivery.title", "Milestone Delivery")}
          </PanelTitle>
        </PanelHeader>
        <EmptyState>
          <FaLock size={32} color={colors.text.muted} />
          <h3>
            {t(
              "invoices.milestoneDelivery.noMilestones",
              "No milestones available",
            )}
          </h3>
        </EmptyState>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer dir={isRTL ? "rtl" : "ltr"}>
      <PanelHeader>
        <PanelTitle>
          {t("invoices.milestoneDelivery.title", "Milestone Delivery")}
        </PanelTitle>
      </PanelHeader>
      <MilestoneGrid>
        {milestones.map((m) => (
          <MilestoneCard key={m.id} unlocked={m.paid}>
            <CardHeader>
              {m.paid ? (
                <FaCheckCircle color={colors.status.success} />
              ) : (
                <FaLock color={colors.status.warning} />
              )}
              <span>{m.title}</span>
            </CardHeader>
            {m.description && <Description>{m.description}</Description>}
            {m.files && m.files.length > 0 && (
              <FileList>
                {m.files.map((file) => (
                  <FileItem key={file.name}>
                    <span>{file.name}</span>
                    {m.paid ? (
                      <DownloadButton
                        onClick={() => handleDownload(file)}
                        small
                      >
                        <FaDownload />
                        {t("files.download", "Download")}
                      </DownloadButton>
                    ) : (
                      <LockedText>
                        <FaLock />
                        {t(
                          "invoices.milestoneDelivery.locked",
                          "Unlocks after payment",
                        )}
                      </LockedText>
                    )}
                  </FileItem>
                ))}
              </FileList>
            )}
          </MilestoneCard>
        ))}
      </MilestoneGrid>
    </PanelContainer>
  );
};

const MilestoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${spacing.md};
`;

const MilestoneCard = styled(Card)`
  padding: ${spacing.md};
  opacity: ${(props) => (props.unlocked ? 1 : 0.6)};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  margin-bottom: ${spacing.sm};

  svg {
    font-size: ${typography.fontSizes.lg};
  }
`;

const Description = styled.p`
  margin: 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${spacing.sm} 0 0 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${typography.fontSizes.sm};
`;

const DownloadButton = styled(ActionButton)`
  ${(props) => props.small && `padding: ${spacing.xs} ${spacing.sm};`}
`;

const LockedText = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.text.muted};
  font-size: ${typography.fontSizes.sm};
`;

export default MilestoneDelivery;
