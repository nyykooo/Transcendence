import { Box, Button, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
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
                Terms of Service for Brunchio
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Last Updated: March 5, 2026
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Agreement to Terms
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                By accessing or using the services provided by Brunchio at https://brunchio.42.fr (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Use of Service
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Use the Service in any way that violates any applicable law or regulation" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Use the Service to transmit any harmful, threatening, abusive, or otherwise objectionable material" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Attempt to gain unauthorized access to any portion of the Service" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Use the Service to infringe upon the rights of others" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Use any automated system to access the Service in a manner that sends more requests than a human can reasonably produce" />
                </ListItem>
            </List>

            <Typography variant="h2" component="h2" gutterBottom>
                Intellectual Property
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                The Service and its original content, features, and functionality are and will remain the exclusive property of Brunchio. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without our prior written consent.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                User Content
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                You retain ownership of any content you submit to or through the Service. By submitting content, you grant Brunchio a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content in connection with operating the Service.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Termination
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Upon termination, your right to use the Service will cease immediately.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Limitation of Liability
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                In no event shall Brunchio, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Your access to or use of (or inability to access or use) the Service" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Any conduct or content of any third party on the Service" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Any content obtained from the Service" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Unauthorized access, use, or alteration of your transmissions or content" />
                </ListItem>
            </List>

            <Typography variant="h2" component="h2" gutterBottom>
                Disclaimer
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Governing Law (EU Users)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                For users in the European Union, these Terms shall be governed by and construed in accordance with applicable EU laws. Nothing in these Terms shall affect your statutory rights as a consumer under applicable EU consumer protection legislation.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Governing Law
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Brunchio operates, without regard to its conflict of law provisions.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Changes to Terms
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </Typography>

            <Typography variant="h2" component="h2" gutterBottom>
                Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                If you have any questions about these Terms of Service, please contact us:
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