import { Box, Button, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <Box 
            sx={{
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 2,
                px: { xs: 2, sm: 4, md: 6 },
                py: 2,
            }}
        >
            <Button 
                variant="outlined" 
                onClick={() => navigate(-1)} 
                sx={{ alignSelf: 'flex-start', mb: 2 }}
            >
                Back
            </Button>
            <Typography variant="h1" component="h1" gutterBottom>
                Privacy Policy for Brunchio
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Last Updated: March 5, 2026
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Introduction
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Brunchio ("we," "us," or "our") operates https://brunchio.42.fr (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                We may collect the following types of information:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Name" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Email address" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Location data" />
                </ListItem>
            </List>
            <Typography variant="body1" sx={{ mb: 2 }}>
                We collect this information when you voluntarily provide it to us, when you use our Service, or through automated technologies.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                We may use the information we collect for various purposes, including to:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Provide, operate, and maintain our Service" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Improve, personalize, and expand our Service" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Understand and analyze how you use our Service" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Develop new products, services, features, and functionality" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Communicate with you for customer service, updates, and marketing purposes" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Process transactions and send related information" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Find and prevent fraud" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Comply with legal obligations" />
                </ListItem>
            </List>

            <Typography variant="h2" component="h2" gutterBottom>
                Data Retention
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Data Security
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Your Rights Under GDPR (European Users)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). Brunchio aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal data.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                You have the following rights:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Right to Access — You have the right to request copies of your personal data." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Right to Rectification — You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Right to Erasure — You have the right to request that we erase your personal data, under certain conditions." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Right to Restrict Processing — You have the right to request that we restrict the processing of your personal data, under certain conditions." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Right to Data Portability — You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Right to Object — You have the right to object to our processing of your personal data, under certain conditions." />
                </ListItem>
            </List>
            <Typography variant="body1" sx={{ mb: 2 }}>
                If you wish to exercise any of these rights, please contact us at brunchio@outlook.com. We will respond to your request within 30 days.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Children's Privacy (COPPA)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us at brunchio@outlook.com. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                If you have any questions about this Privacy Policy, please contact us:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="By email: brunchio@outlook.com" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="By visiting: https://brunchio.42.fr" />
                </ListItem>
            </List>

            <Divider sx={{ width: '100%', my: 2 }} />
            <Typography variant="caption" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                This document was generated by PolicyGen and is provided for informational purposes only. It does not constitute legal advice. Please consult with a qualified attorney to ensure compliance with applicable laws.
            </Typography>
        </Box>
    );
}